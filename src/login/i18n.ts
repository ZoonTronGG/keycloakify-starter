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
            "identity-provider-login-label": "Или войдите через"
        },
        en: {
            loginAccountTitle: "Sign in to your account",
            welcomeMessage: "Welcome to Akzhol!",
            "identity-provider-login-label": "Or sign in with"
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
