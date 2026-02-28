
export const theme = {
    colors: {
        background: '#f5f6f8',
        cardBg: '#ffffff',
        textPrimary: '#1a1a1a',
        textSecondary: '#666666',
        textHeader: '#888888',
        border: '#e0e0e0',
        primary: '#1976d2',
        subtleBg: '#fafafa'
    },
    layout: {
        maxWidth: '1200px',
        contentPadding: '24px 16px',
        cardPadding: 24,
        cardGap: 24
    }
}

export const styles = {
    pageWrapper: {
        background: theme.colors.background,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
    } as React.CSSProperties,

    header: {
        background: theme.colors.cardBg,
        borderBottom: `1px solid #e8e8e8`,
        padding: '16px 0'
    } as React.CSSProperties,

    headerContent: {
        maxWidth: theme.layout.maxWidth,
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
    } as React.CSSProperties,

    title: {
        fontSize: 20,
        fontWeight: 700,
        color: theme.colors.textPrimary,
        letterSpacing: '-0.02em',
        marginBottom: 8
    } as React.CSSProperties,

    mainContent: {
        maxWidth: theme.layout.maxWidth,
        margin: '0 auto',
        padding: theme.layout.contentPadding,
        width: '100%'
    } as React.CSSProperties,

    card: {
        background: theme.colors.cardBg,
        borderRadius: 12,
        padding: theme.layout.cardPadding,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        marginBottom: theme.layout.cardGap
    } as React.CSSProperties,

    sectionHeader: {
        fontSize: 13,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: theme.colors.textHeader,
        marginBottom: 12
    } as React.CSSProperties,

    subLabel: {
        fontSize: 13,
        fontWeight: 500,
        color: theme.colors.textSecondary,
        marginBottom: 8,
        display: 'block'
    } as React.CSSProperties,

    editorWrapper: {
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 8,
        overflow: 'hidden'
    } as React.CSSProperties,

    visualBuilderArea: {
        background: theme.colors.subtleBg,
        borderRadius: 8,
        padding: 16,
        border: '1px solid #eee'
    } as React.CSSProperties,

    // SxProps for MUI components
    primaryButton: {
        variant: 'contained',
        disableElevation: true,
        size: 'small',
        sx: {
            borderRadius: 6,
            textTransform: 'none',
            fontWeight: 500
        }
    } as any, // Using any here to allow spreading into Button props

    secondaryButton: {
        variant: 'outlined',
        size: 'small',
        sx: {
            borderRadius: 6,
            textTransform: 'none',
            fontWeight: 500,
            borderColor: theme.colors.border,
            color: theme.colors.textSecondary,
            '&:hover': {
                borderColor: theme.colors.textSecondary,
                background: 'rgba(0,0,0,0.02)'
            }
        }
    } as any,
    
    tabIndicator: {
        borderRadius: 2,
        height: 3
    } as React.CSSProperties,
    
    tabLabel: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: 14,
        minWidth: 'auto',
        padding: '8px 16px'
    } as React.CSSProperties
}
