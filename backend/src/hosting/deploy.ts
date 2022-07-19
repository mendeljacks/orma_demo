import cuid from 'cuid'
import git from 'git-rev-sync'
import { run_process } from './helpers/run_process'

export const deploy = async () => {
    try {
        process.chdir('../')
        const version = 'GIT_' + git.short() + '_GID_' + cuid()

        await Promise.all([heroku(version)])

        await run_process(['docker', 'image', 'prune', '-af'])
        console.log('Done')
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

const heroku = async version => {
    const dev_app_name = 'orma-demo'
    const docker_image_path2 = `registry.heroku.com/${dev_app_name}/web`
    const heroku_username = 'mendel.jacks@no3rd.ca'

    const heroku_login = await run_process([
        'docker',
        'login',
        `--username=${heroku_username}`,
        `--password=${process.env.HEROKU_API_KEY}`,
        'registry.heroku.com'
    ])
    const heroku_build = await run_process([
        'docker',
        'build',
        '-f',
        'backend/src/hosting/Dockerfile',
        '--tag',
        docker_image_path2,
        '.'
    ])

    await run_process(['docker', 'push', docker_image_path2])

    const released = await run_process([
        'heroku',
        'container:release',
        'web',
        '--app',
        dev_app_name
    ])
}
