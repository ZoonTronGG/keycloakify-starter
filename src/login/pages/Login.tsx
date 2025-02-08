import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";
import Link from "@mui/material/Link";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;
    const { msg } = i18n;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}{" "}
                            <a tabIndex={8} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={
                realm.password &&
                (social?.providers ?? []).length > 0 && (
                    <div
                        id="kc-social-providers"
                        className={kcClsx("kcFormSocialAccountSectionClass")}
                        style={{ padding: "1rem", marginTop: "2rem" }}
                    >
                        <hr style={{ margin: "1.5rem 0" }} />
                        {/* Use Box component with sx prop for responsive styling */}
                        <Box
                            component="h2"
                            sx={{
                                fontSize: {
                                    xs: "1.2rem",
                                    sm: "1.5rem"
                                },
                                textAlign: "center",
                                marginBottom: "0.5rem"
                            }}
                        >
                            {msg("identity-provider-login-label")}
                        </Box>
                        {/* Use Box component with sx prop for grid styling */}
                        <Box
                            component="ul"
                            sx={{
                                display: "grid",
                                gap: "1rem",
                                padding: 0,
                                listStyle: "none",
                                gridTemplateColumns: {
                                    xs: "repeat(2, 1fr)",
                                    sm: "repeat(auto-fit, minmax(150px, 1fr))"
                                }
                            }}
                        >
                            {(social?.providers ?? []).map(p => (
                                <li key={p.alias} style={{ minWidth: "120px" }}>
                                    <Box
                                        component="a"
                                        id={`social-${p.alias}`}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: "0.8rem",
                                            fontSize: "0.9rem",
                                            borderRadius: "4px",
                                            border: "1px solid #ddd",
                                            textDecoration: "none",
                                            transition: "background-color 0.2s",
                                            "&:hover": {
                                                backgroundColor: "#f5f5f5"
                                            }
                                        }}
                                        href={p.loginUrl}
                                    >
                                        {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                                        <span
                                            className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                                            dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                        ></span>
                                    </Box>
                                </li>
                            ))}
                        </Box>
                    </div>
                )
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper" style={{ maxWidth: "600px", margin: "0 auto" }}>
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                        >
                            {!usernameHidden && (
                                <div className={kcClsx("kcFormGroupClass")} style={{ paddingBottom: "1rem" }}>
                                    <TextField
                                        sx={{
                                            width: "100%",
                                            "@media (max-width: 600px)": {
                                                fontSize: "0.9rem"
                                            }
                                        }}
                                        label={
                                            !realm.loginWithEmailAllowed
                                                ? msg("username")
                                                : realm.registrationEmailAsUsername
                                                  ? msg("usernameOrEmail")
                                                  : msg("email")
                                        }
                                        tabIndex={2}
                                        variant="outlined"
                                        name="username"
                                        defaultValue={login.username ?? ""}
                                        autoFocus
                                        autoComplete="username"
                                        error={messagesPerField.existsError("username", "password")}
                                        helperText={
                                            messagesPerField.existsError("username", "password") && (
                                                <span
                                                    aria-live="polite"
                                                    dangerouslySetInnerHTML={{
                                                        __html: messagesPerField.getFirstError("username", "password")
                                                    }}
                                                />
                                            )
                                        }
                                    />
                                </div>
                            )}

                            <div
                                className={kcClsx("kcFormGroupClass")}
                                style={{ paddingBottom: "0rem" }} // Reduced from 1.5rem to 0.5rem
                            >
                                <FormControl
                                    sx={{
                                        width: "100%",
                                        "& .MuiInputBase-root": {
                                            fontSize: { xs: "0.9rem", sm: "1rem" }
                                        }
                                    }}
                                    variant="outlined"
                                >
                                    <InputLabel htmlFor="outlined-adornment-password">{msg("password")}</InputLabel>
                                    <OutlinedInput
                                        tabIndex={3}
                                        name="password"
                                        autoComplete="current-password"
                                        error={messagesPerField.existsError("username", "password")}
                                        id="outlined-adornment-password"
                                        type={showPassword ? "text" : "password"}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={showPassword ? "hide the password" : "display the password"}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    onMouseDown={e => e.preventDefault()}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                    {usernameHidden && messagesPerField.existsError("username", "password") && (
                                        <FormHelperText>
                                            <span
                                                aria-live="polite"
                                                dangerouslySetInnerHTML={{
                                                    __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                }}
                                            />
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </div>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    gap: 1,
                                    alignItems: "center",
                                    mt: 0 // Ensure there's no top margin
                                }}
                                className={clsx(kcClsx("kcFormGroupClass"), kcClsx("kcFormSettingClass"))}
                            >
                                <div id="kc-form-options" style={{ display: "flex", alignItems: "center" }}>
                                    {realm.rememberMe && !usernameHidden && (
                                        <>
                                            <Checkbox defaultChecked={!!login.rememberMe} tabIndex={5} name="rememberMe" sx={{ padding: 0 }} />
                                            <span style={{ marginLeft: "0.5rem", display: "flex", alignItems: "center" }}>{msg("rememberMe")}</span>
                                        </>
                                    )}
                                </div>

                                <div className={kcClsx("kcFormOptionsWrapperClass")}>
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <Link tabIndex={6} href={url.loginResetCredentialsUrl}>
                                                {msg("doForgotPassword")}
                                            </Link>
                                        </span>
                                    )}
                                </div>
                            </Box>

                            <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <Button
                                    sx={{
                                        width: "100%",

                                        fontSize: { xs: "0.9rem", sm: "1rem" },
                                        py: { xs: "0.5rem", sm: "0.7rem" },
                                        backgroundColor: "#4CAF50",
                                        "&:hover": {
                                            backgroundColor: "#388E3C"
                                        }
                                    }}
                                    tabIndex={7}
                                    variant="contained"
                                    type="submit"
                                    disabled={isLoginButtonDisabled}
                                    name="login"
                                >
                                    {msg("doLogIn")}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}
