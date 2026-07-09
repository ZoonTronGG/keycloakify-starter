import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

const KNOWN_PROVIDERS: Record<string, "google" | "apple"> = {
    google: "google",
    apple: "apple"
};

function SocialIcon({ alias }: { alias: string }) {
    const kind = KNOWN_PROVIDERS[alias.toLowerCase()] ?? "default";

    if (kind === "google") {
        return (
            <svg className="akzhol-social-icon" viewBox="0 0 48 48" aria-hidden="true">
                <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.5 4.2-5.5 7.2-11.3 7.2-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.1-5.1C33.8 5.7 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11.1 0 20-8.9 20-20 0-1.2-.1-2.4-.4-3.5z"
                />
                <path
                    fill="#FF3D00"
                    d="M6.3 14.7l5.9 4.3C13.7 15.5 18.5 12 24 12c3 0 5.7 1.1 7.8 3l5.1-5.1C33.8 5.7 29.2 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
                />
                <path
                    fill="#4CAF50"
                    d="M24 44c5.1 0 9.7-1.7 13.3-4.6l-6.1-5.2c-2 1.4-4.5 2.2-7.2 2.2-5.7 0-10.5-3.9-12.2-9.1l-6 4.6C9.5 39.6 16.2 44 24 44z"
                />
                <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20.4H24v7.2h11.3c-.7 2-2 3.7-3.7 5l6.1 5.2C40.6 35.8 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"
                />
            </svg>
        );
    }

    if (kind === "apple") {
        return (
            <svg className="akzhol-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="#000"
                    d="M16.365 1.43c0 1.14-.42 2.27-1.243 3.083-.853.86-2.058 1.49-3.156 1.4-.13-1.118.43-2.27 1.187-3 .8-.823 2.187-1.43 3.212-1.483zM20.5 17.34c-.5 1.13-.74 1.633-1.387 2.633-.9 1.39-2.17 3.13-3.745 3.143-1.4.013-1.76-.91-3.66-.9-1.9.013-2.296.916-3.696.903-1.575-.013-2.778-1.583-3.678-2.973-2.52-3.873-2.785-8.41-1.23-10.83 1.103-1.717 2.844-2.72 4.48-2.72 1.665 0 2.71.91 4.085.91 1.337 0 2.15-.91 4.075-.91 1.453 0 2.99.79 4.085 2.157-3.59 1.967-3.005 7.107.67 8.587z"
                />
            </svg>
        );
    }

    return <span className="akzhol-social-icon akzhol-social-icon--default" aria-hidden="true" />;
}

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, Template, doUseDefaultCss, classes } = props;

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div className="akzhol-register">
                    <span>
                        {msg("noAccount")}{" "}
                        <a tabIndex={8} href={url.registrationUrl}>
                            {msg("doRegister")}
                        </a>
                    </span>
                </div>
            }
            socialProvidersNode={
                realm.password && social?.providers !== undefined && social.providers.length > 0 ? (
                    <div className="akzhol-social">
                        <div className="akzhol-social-divider">
                            <span>{msg("identity-provider-login-label")}</span>
                        </div>
                        <ul className="akzhol-social-list">
                            {social.providers.map(p => (
                                <li key={p.alias}>
                                    <a
                                        id={`social-${p.alias}`}
                                        className={`akzhol-social-btn akzhol-social-btn--${p.alias.toLowerCase()}`}
                                        href={p.loginUrl}
                                    >
                                        <SocialIcon alias={p.alias} />
                                        <span
                                            className="akzhol-social-name"
                                            dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null
            }
        >
            <div id="kc-form" className="akzhol-form-wrapper">
                {realm.password && (
                    <form
                        id="kc-form-login"
                        className="akzhol-form"
                        onSubmit={() => {
                            setIsLoginButtonDisabled(true);
                            return true;
                        }}
                        action={url.loginAction}
                        method="post"
                    >
                        {!usernameHidden && (
                            <div className="akzhol-field">
                                <label htmlFor="username" className="akzhol-label">
                                    {!realm.loginWithEmailAllowed
                                        ? msg("username")
                                        : realm.registrationEmailAsUsername
                                          ? msg("email")
                                          : msg("usernameOrEmail")}
                                </label>
                                <input
                                    tabIndex={2}
                                    id="username"
                                    className="akzhol-input"
                                    name="username"
                                    defaultValue={login.username ?? ""}
                                    type="text"
                                    autoFocus
                                    autoComplete="username"
                                    aria-invalid={messagesPerField.existsError("username", "password")}
                                />
                                {messagesPerField.existsError("username", "password") && (
                                    <span
                                        id="input-error"
                                        className="akzhol-error"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        <div className="akzhol-field">
                            <label htmlFor="password" className="akzhol-label">
                                {msg("password")}
                            </label>
                            <PasswordWrapper i18n={i18n} passwordInputId="password">
                                <input
                                    tabIndex={3}
                                    id="password"
                                    className="akzhol-input"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    aria-invalid={messagesPerField.existsError("username", "password")}
                                />
                            </PasswordWrapper>
                            {usernameHidden && messagesPerField.existsError("username", "password") && (
                                <span
                                    id="input-error"
                                    className="akzhol-error"
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                    }}
                                />
                            )}
                        </div>

                        {((realm.rememberMe && !usernameHidden) || realm.resetPasswordAllowed) && (
                            <div className="akzhol-form-options">
                                {realm.rememberMe && !usernameHidden && (
                                    <label className="akzhol-remember">
                                        <input
                                            tabIndex={5}
                                            id="rememberMe"
                                            name="rememberMe"
                                            type="checkbox"
                                            defaultChecked={!!login.rememberMe}
                                        />
                                        <span>{msg("rememberMe")}</span>
                                    </label>
                                )}
                                {realm.resetPasswordAllowed && (
                                    <a className="akzhol-link" tabIndex={6} href={url.loginResetCredentialsUrl}>
                                        {msg("doForgotPassword")}
                                    </a>
                                )}
                            </div>
                        )}

                        <div className="akzhol-form-buttons">
                            <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                            <button
                                tabIndex={7}
                                disabled={isLoginButtonDisabled}
                                className="akzhol-btn-primary"
                                name="login"
                                id="kc-login"
                                type="submit"
                            >
                                {msgStr("doLogIn")}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Template>
    );
}

function PasswordWrapper(props: { i18n: I18n; passwordInputId: string; children: React.ReactNode }) {
    const { i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

    return (
        <div className="akzhol-password">
            {children}
            <button
                type="button"
                className="akzhol-password-toggle"
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                {isPasswordRevealed ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path
                            fill="currentColor"
                            d="M2 5.27 3.28 4l16.97 16.97-1.27 1.28-2.46-2.46A11.8 11.8 0 0 1 12 21C5 21 1 12 1 12a17.8 17.8 0 0 1 4.06-5.66L2 5.27ZM12 8a4 4 0 0 1 4 4 4 4 0 0 1-.4 1.74L13.26 11.4A2 2 0 0 0 12 10a2 2 0 0 0-1.4.6L8.46 8.45A4 4 0 0 1 12 8Zm0-3a17.8 17.8 0 0 1 11 7s-1.1 2.45-3.06 4.66l-2.85-2.85A4 4 0 0 0 12 8c-.46 0-.91.08-1.33.22L8.5 5.85A11.6 11.6 0 0 1 12 5Z"
                        />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path
                            fill="currentColor"
                            d="M12 5C5 5 1 12 1 12s4 7 11 7 11-7 11-7-4-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}
