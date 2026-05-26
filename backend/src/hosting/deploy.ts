// Deploys the orma_demo backend to the no3rd Kubernetes cluster
// under the `orma-playground` namespace.
//
// Local usage (one-time, from backend/):
//   KUBECONFIG=$HOME/.kube/config.no3rd npm run deploy_init   # namespace + pull secret
//   KUBECONFIG=$HOME/.kube/config.no3rd npm run deploy        # build, push, apply, rollout
//
// CI usage: GitHub Actions sets KUBECONFIG_BASE64 + REGISTRY_USER + REGISTRY_PASSWORD
// and runs `npm run deploy`.
//
// The backend takes no env vars (db connection arrives per request as a header),
// so there is no `deploy_secrets` step.

import { execSync } from 'child_process'
import { writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const REGISTRY = 'registry.no3rd.com'
const NAMESPACE = 'orma-playground'
const IMAGE = `${REGISTRY}/${NAMESPACE}-backend`
const HOST = 'orma-playground-api.ormatechnology.com'
const PULL_SECRET = 'private-registry'
const TAG = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14) // e.g. 20260319120530

const ROOT = process.cwd().replace(/\/backend$/, '')
const HOSTING_DIR = join(ROOT, 'backend/src/hosting')

// Resolve a kubeconfig. CI passes KUBECONFIG_BASE64; locally we honour
// either an existing KUBECONFIG or fall back to ~/.kube/config.no3rd.
const KUBECONFIG_PATH = (() => {
    if (process.env.KUBECONFIG_BASE64) {
        const tmp = join(ROOT, '.kubeconfig')
        writeFileSync(
            tmp,
            Buffer.from(process.env.KUBECONFIG_BASE64, 'base64').toString('utf-8'),
            { mode: 0o600 }
        )
        return tmp
    }
    if (process.env.KUBECONFIG) return process.env.KUBECONFIG
    const fallback = join(process.env.HOME || '', '.kube/config.no3rd')
    if (existsSync(fallback)) return fallback
    throw new Error('No kubeconfig: set KUBECONFIG or KUBECONFIG_BASE64')
})()

const run = (cmd: string, cwd?: string) => {
    console.log(`> ${cmd}`)
    execSync(cmd, {
        stdio: 'inherit',
        cwd: cwd || process.cwd(),
        env: { ...process.env, KUBECONFIG: KUBECONFIG_PATH }
    })
}

const step = (name: string, fn: () => void) => {
    console.log(`\n=== ${name} ===\n`)
    fn()
    console.log(`Done: ${name}`)
}

const try_step = (name: string, fn: () => void) => {
    try {
        step(name, fn)
    } catch {
        console.log(`(skipped) ${name}`)
    }
}

export const deploy_init = async () => {
    try_step('Create namespace', () => {
        run(`kubectl apply -f ${HOSTING_DIR}/k8s_namespace.yaml`)
    })

    try_step(`Copy ${PULL_SECRET} from backend namespace to ${NAMESPACE}`, () => {
        run(
            `kubectl get secret ${PULL_SECRET} -n backend -o json | ` +
                `sed 's/"namespace": "backend"/"namespace": "${NAMESPACE}"/' | ` +
                `kubectl apply -f -`
        )
    })

    console.log('\nCluster initialised for orma-playground.')
    console.log(`DNS reminder: ${HOST} must point at the no3rd cluster IP (Cloudflare A-record).`)
}

export const deploy = async () => {
    try {
        if (process.env.REGISTRY_USER && process.env.REGISTRY_PASSWORD) {
            step('Docker login to registry', () => {
                run(
                    `echo "${process.env.REGISTRY_PASSWORD}" | ` +
                        `docker login ${REGISTRY} -u ${process.env.REGISTRY_USER} --password-stdin`
                )
            })
        }

        step('Build and push backend image', () => {
            run(
                `docker build -f backend/src/hosting/Dockerfile ` +
                    `-t ${IMAGE}:${TAG} -t ${IMAGE}:latest .`,
                ROOT
            )
            run(`docker push ${IMAGE}:${TAG}`)
            run(`docker push ${IMAGE}:latest`)
        })

        step('Apply manifests', () => {
            run(`kubectl apply -f ${HOSTING_DIR}/k8s_namespace.yaml`)
            run(`kubectl apply -f ${HOSTING_DIR}/k8s_backend.yaml`)
            run(`kubectl apply -f ${HOSTING_DIR}/k8s_ingress.yaml`)
        })

        step('Roll out new image', () => {
            run(
                `kubectl set image deployment/backend backend=${IMAGE}:${TAG} -n ${NAMESPACE}`
            )
            run(`kubectl rollout status deployment/backend -n ${NAMESPACE} --timeout=180s`)
        })

        console.log(`\nDeployed: https://${HOST} (${TAG})`)
    } catch (err) {
        console.error('Deployment failed:', err)
        process.exit(1)
    }
}

