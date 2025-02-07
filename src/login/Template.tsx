import { useEffect, useMemo } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { useStyles } from "tss-react/mui";
import akzholLogo from "./photo/logo.png";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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
    const { msg, msgStr } = i18n;
    const { auth, url, message, isAppInitiatedAction } = kcContext;

    // Memoize expensive calculations
    const containerStyles = useMemo(
        () => ({
            minHeight: "100dvh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 2, sm: 4 },
            bgcolor: "background.default"
        }),
        []
    );

    const cardStyles = useMemo(
        () => ({
            width: { xs: "100%", sm: "90%", md: "80%" },
            maxWidth: 800,
            p: { xs: 3, sm: 4, md: 6 },
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: { xs: 2, sm: 4 },
            bgcolor: "background.paper",
            overflow: "hidden"
        }),
        []
    );

    // Set document title
    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, [documentTitle, msgStr, kcContext.realm.displayName]);

    // Set HTML and body class names
    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });
    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });
    const { cx } = useStyles();

    if (!isReadyToRender) {
        return null;
    }
    return (
        <Box className={cx(kcClsx("kcLoginClass"))} sx={containerStyles}>
            <Box sx={cardStyles}>
                {/* Header Section */}
                <Box
                    id="kc-header"
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "center",
                        gap: { xs: 2, sm: 3 },
                        mb: { xs: 3, sm: 4 }
                    }}
                >
                    <Box
                        id="kc-header-logo"
                        sx={{
                            flexShrink: 0,
                            width: { xs: "clamp(80px, 20vw, 120px)", sm: 120 },
                            "& img": {
                                width: "100%",
                                height: "auto",
                                display: "block"
                            }
                        }}
                    >
                        <img src={akzholLogo} alt="Akzhol Logo" loading="lazy" width={120} height={120} />
                    </Box>
                    <Box
                        id="kc-header-text"
                        sx={{
                            textAlign: { xs: "center", sm: "left" },
                            width: "100%",
                            pl: { sm: 2, md: 3 }, // Responsive left padding
                            pr: { xs: 1, sm: 0 }, // Right padding for smallest screens
                            // Add minimum horizontal margins to prevent edge overlap
                            mx: { xs: 0.5, sm: 0 },
                            // Containment for better zoom behavior
                            maxWidth: { sm: "calc(100% - 140px)", md: "calc(100% - 160px)" },
                            wordBreak: "break-word",
                            overflowWrap: "break-word"
                        }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: {
                                    xs: "clamp(1.25rem, 4vw, 1.5rem)",
                                    sm: "clamp(1.5rem, 2.5vw, 1.75rem)",
                                    md: "clamp(1.75rem, 2vw, 2rem)"
                                },
                                lineHeight: 1.2,
                                fontWeight: 500,
                                color: "black",
                                // Add responsive margins
                                my: { xs: 1, sm: 0 }, // Vertical margins
                                // Prevent text overflow
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                // Safe area padding for zoom
                                paddingLeft: { sm: "env(safe-area-inset-left)", xs: 0 },
                                paddingRight: { sm: "env(safe-area-inset-right)", xs: 0 }
                            }}
                        >
                            Добро пожаловать в Akzhol!
                        </Typography>
                    </Box>
                </Box>

                {/* Main Content */}
                <Box
                    id="kc-content"
                    sx={{
                        "& .MuiButton-root": {
                            py: { xs: 1.5, sm: 2 },
                            px: { xs: 3, sm: 4 },
                            fontSize: { xs: "0.9rem", sm: "1rem" }
                        },
                        "& .MuiInputBase-root": {
                            fontSize: { xs: "0.9rem", sm: "1rem" }
                        }
                    }}
                >
                    <Box id="kc-content-wrapper">
                        {/* Modified header content section - Start */}
                        {displayRequiredFields ? (
                            <Box className={kcClsx("kcContentWrapperClass")}>
                                <Box className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                    <Typography variant="subtitle2" component="span">
                                        <span className="required">*</span>
                                        {msg("requiredFields")}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: "100%" }}>
                                    <Typography variant="h6" component="h1" gutterBottom sx={{ color: "black" }}>
                                        {headerNode}
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Typography variant="h6" component="h1" gutterBottom sx={{ color: "black" }}>
                                {headerNode}
                            </Typography>
                        )}
                        {/* Modified header content section - End */}

                        {/* Alert Messages */}
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <Alert
                                variant="filled"
                                severity={message.type}
                                sx={{
                                    mb: 2,
                                    mt: 3,
                                    "& .MuiAlert-message": {
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }
                                }}
                            >
                                <span className={kcClsx("kcAlertTitleClass")} dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                            </Alert>
                        )}

                        {children}

                        {/* Social Providers */}
                        {auth?.showTryAnotherWayLink && (
                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                <Box className={kcClsx("kcFormGroupClass")}>
                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                    <Typography
                                        component="a"
                                        href="#"
                                        onClick={e => {
                                            e.preventDefault();
                                        }}
                                        sx={{
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            color: "primary.main"
                                        }}
                                    >
                                        {msg("doTryAnotherWay")}
                                    </Typography>
                                </Box>
                            </form>
                        )}

                        {socialProvidersNode}

                        {displayInfo && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mt: 3,
                                    px: { xs: 1, sm: 0 }
                                }}
                            >
                                {infoNode}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
