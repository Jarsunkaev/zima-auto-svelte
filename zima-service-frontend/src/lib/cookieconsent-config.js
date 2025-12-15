import { t } from '$lib/translations';

export const config = {
    guiOptions: {
        consentModal: {
            layout: "box",
            position: "bottom right",
            equalWeightButtons: true,
            flipButtons: false
        },
        preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: false
        }
    },
    categories: {
        necessary: {
            enabled: true,
            readOnly: true
        },
        analytics: {
            enabled: true,
            readOnly: false
        }
    },
    language: {
        default: 'en',
        translations: {
            en: {
                consentModal: {
                    title: t('cookieConsent.title'),
                    description: t('cookieConsent.message'),
                    acceptAllBtn: t('cookieConsent.accept'),
                    acceptNecessaryBtn: t('cookieConsent.decline'),
                    showPreferencesBtn: t('cookieConsent.learnMore')
                },
                preferencesModal: {
                    title: t('cookieConsent.title'),
                    acceptAllBtn: t('cookieConsent.accept'),
                    acceptNecessaryBtn: t('cookieConsent.decline'),
                    savePreferencesBtn: t('cookieConsent.accept'),
                    closeIconLabel: "Close modal",
                    sections: [
                        {
                            title: t('cookieConsent.title'),
                            description: t('cookieConsent.message')
                        },
                        {
                            title: "Analytics",
                            description: "These cookies collect information about how you use our website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you.",
                            linkedCategory: "analytics"
                        }
                    ]
                }
            },
            hu: {
                consentModal: {
                    title: t('cookieConsent.title'),
                    description: t('cookieConsent.message'),
                    acceptAllBtn: t('cookieConsent.accept'),
                    acceptNecessaryBtn: t('cookieConsent.decline'),
                    showPreferencesBtn: t('cookieConsent.learnMore')
                },
                preferencesModal: {
                    title: t('cookieConsent.title'),
                    acceptAllBtn: t('cookieConsent.accept'),
                    acceptNecessaryBtn: t('cookieConsent.decline'),
                    savePreferencesBtn: t('cookieConsent.accept'),
                    closeIconLabel: "Bezárás",
                    sections: [
                        {
                            title: t('cookieConsent.title'),
                            description: t('cookieConsent.message')
                        },
                        {
                            title: "Analitika",
                            description: "Ezek a sütik információkat gyűjtenek arról, hogyan használja weboldalunkat, mely oldalakat látogatta meg és milyen linkekre kattintott. Minden adat anonimizált és nem használható fel azonosításra.",
                            linkedCategory: "analytics"
                        }
                    ]
                }
            }
        }
    }
}; 