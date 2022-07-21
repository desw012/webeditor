import i18next from "i18next";
import HttpBackend from 'i18next-http-backend';

export const init_i18n = async (config) => {
    await i18next.use(HttpBackend).init({
        lng : config.locale
        , fallbackLng : 'ko'
        , backend: {
            loadPath: `${config.url}/locales/{{lng}}/{{ns}}.json`
        }
    });
}