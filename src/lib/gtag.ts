declare global {
    interface Window {
        gtag: (...args: any[]) => void
    }
}

export const gtagReportConversion = (url?: string) => {
    console.log("test conve");
    const callback = () => {
        if (url) {
            window.location.href = url
        }
    }

    window.gtag?.('event', 'conversion', {
        send_to: 'AW-679583815/QsSACOPai8wBEMfAhsQC',
        event_callback: callback,
    })
}