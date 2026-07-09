import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, Template, doUseDefaultCss, classes } = props;

    const { url, realm, auth, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo
            displayMessage={!messagesPerField.existsError("username")}
            infoNode={
                <div className="akzhol-register">
                    {realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
                </div>
            }
            headerNode={msg("emailForgotTitle")}
        >
            <div id="kc-form" className="akzhol-form-wrapper">
                <form id="kc-reset-password-form" className="akzhol-form" action={url.loginAction} method="post">
                    <div className="akzhol-field">
                        <label htmlFor="username" className="akzhol-label">
                            {!realm.loginWithEmailAllowed
                                ? msg("username")
                                : realm.registrationEmailAsUsername
                                  ? msg("email")
                                  : msg("usernameOrEmail")}
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="akzhol-input"
                            autoFocus
                            defaultValue={auth.attemptedUsername ?? ""}
                            aria-invalid={messagesPerField.existsError("username")}
                        />
                        {messagesPerField.existsError("username") && (
                            <span
                                id="input-error-username"
                                className="akzhol-error"
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("username"))
                                }}
                            />
                        )}
                    </div>

                    <div className="akzhol-form-options">
                        <a
                            className="akzhol-link"
                            href={url.loginUrl}
                            dangerouslySetInnerHTML={{ __html: kcSanitize(msgStr("backToLogin")) }}
                        />
                    </div>

                    <div className="akzhol-form-buttons">
                        <button className="akzhol-btn-primary" type="submit">
                            {msgStr("doSubmit")}
                        </button>
                    </div>
                </form>
            </div>
        </Template>
    );
}
