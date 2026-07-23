/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        ru: {
            loginAccountTitle: "Вход в учётную запись",
            welcomeMessage: "Добро пожаловать в Akzhol!",
            "identity-provider-login-label": "Или войдите через",
            // First-broker-login pages (Google/Apple вход при существующем
            // email): этих двух ключей нет в базовом ru-бандле Keycloak 26 —
            // на устройствах они отображались по-английски.
            loginIdpReviewProfileTitle: "Проверьте данные профиля",
            requiredFields: "Обязательные поля"
        },
        en: {
            loginAccountTitle: "Sign in to your account",
            welcomeMessage: "Welcome to Akzhol!",
            "identity-provider-login-label": "Or sign in with",
            // Same values as the base theme — present only because custom
            // translations must define every key for every locale.
            loginIdpReviewProfileTitle: "Update Account Information",
            requiredFields: "Required fields"
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
