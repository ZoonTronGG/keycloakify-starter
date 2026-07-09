import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import akzholLogo from "./photo/akzhol-logo.png";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;
    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });
    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className="akzhol-page">
            <div className="akzhol-card" id="kc-content">
                <div className="akzhol-brand">
                    <img className="akzhol-logo" src={akzholLogo} alt="Akzhol" />
                    <h1 className="akzhol-welcome">{msg("welcomeMessage")}</h1>
                </div>
                {realm.internationalizationEnabled && (enabledLanguages?.length ?? 0) > 1 && (
                    <div className="akzhol-locale">
                        <select
                            id="kc-locale-select"
                            value={currentLanguage.languageTag}
                            onChange={event => {
                                const language = enabledLanguages.find(({ languageTag }) => languageTag === event.target.value);
                                if (language) {
                                    window.location.href = language.href;
                                }
                            }}
                        >
                            {enabledLanguages.map(({ languageTag, label }) => (
                                <option key={languageTag} value={languageTag}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <header className="akzhol-header">
                    {(() => {
                        const node =
                            auth !== undefined && auth.showUsername && !auth.showResetCredentials ? (
                                <div id="kc-username" className="akzhol-username">
                                    <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                    <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                        <span className="kc-login-tooltip">
                                            <i className={kcClsx("kcResetFlowIcon")}></i>
                                            <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                        </span>
                                    </a>
                                </div>
                            ) : (
                                <h2 id="kc-page-title">{headerNode}</h2>
                            );

                        if (displayRequiredFields) {
                            return (
                                <div className={kcClsx("kcContentWrapperClass")}>
                                    <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                        <span className="subtitle">
                                            <span className="required">*</span> {msg("requiredFields")}
                                        </span>
                                    </div>
                                    <div className="col-md-10">{node}</div>
                                </div>
                            );
                        }

                        return node;
                    })()}
                </header>
                <div id="kc-content-wrapper">
                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <div
                            className={`alert-${message.type} ${kcClsx("kcAlertClass")} pf-m-${message?.type === "error" ? "danger" : message.type}`}
                        >
                            <div className="pf-c-alert__icon">
                                {message.type === "success" && <span className={kcClsx("kcFeedbackSuccessIcon")}></span>}
                                {message.type === "warning" && <span className={kcClsx("kcFeedbackWarningIcon")}></span>}
                                {message.type === "error" && <span className={kcClsx("kcFeedbackErrorIcon")}></span>}
                                {message.type === "info" && <span className={kcClsx("kcFeedbackInfoIcon")}></span>}
                            </div>
                            <span
                                className={kcClsx("kcAlertTitleClass")}
                                dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }}
                            />
                        </div>
                    )}
                    {children}
                    {auth !== undefined && auth.showTryAnotherWayLink && (
                        <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                            <div className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" name="tryAnotherWay" value="on" />
                                <a
                                    href="#"
                                    id="try-another-way"
                                    onClick={() => {
                                        (document.getElementById("kc-select-try-another-way-form") as HTMLFormElement).submit();
                                        return false;
                                    }}
                                >
                                    {msg("doTryAnotherWay")}
                                </a>
                            </div>
                        </form>
                    )}
                    {socialProvidersNode}
                    {displayInfo && (
                        <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                            <div id="kc-info-wrapper" className={kcClsx("kcInfoAreaWrapperClass")}>
                                {infoNode}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
