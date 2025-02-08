import type {} from "react";
import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";
import { tss } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

// Lazy-loaded components
const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);
const Login = lazy(() => import("./pages/Login"));
const doMakeUserConfirmPassword = true;

// Enhanced theme configuration
export const theme = createTheme({
    palette: {
        mode: "light",
        background: {
            default: "#4caf50",
            paper: "#ffffff"
        },
        text: {
            primary: "#000000",
            secondary: "rgba(0,0,0,0.52)"
        },
        primary: {
            main: "#388e3c" // Darker green for primary elements
        }
    },
    typography: {
        fontFamily: [
            "Montserrat",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(","),
        h1: {
            fontSize: "2.5rem",
            fontWeight: 700
        },
        button: {
            fontSize: "1rem"
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ".kcLoginClass": {
                    boxSizing: "content-box"
                },
                // Moved centeredTitle into styleOverrides as a CSS class
                ".centeredTitle": {
                    textAlign: "center"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600
                }
            },
            defaultProps: {
                variant: "contained",
                color: "primary"
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#388e3c" // Darker green
                }
            }
        }
    },
    spacing: 8,
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536
        }
    },
    transitions: {
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375
        }
    }
});

export default function KcPage(props: { kcContext: KcContext }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <KcPageContextualized {...props} />
        </ThemeProvider>
    );
}

function KcPageContextualized(props: { kcContext: KcContext }) {
    const { kcContext } = props;
    const { i18n } = useI18n({ kcContext });
    const { classes } = useStyles();

    return (
        <Suspense fallback={null}>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return (
                            <Login
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                                // Removed invalid htmlClass and bodyClass props
                            />
                        );
                    default:
                        return (
                            <DefaultPage
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                                // Removed invalid htmlClass and bodyClass props
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const useStyles = tss.create(
    ({ theme }) =>
        ({
            kcHtmlClass: {
                ":root": {
                    colorScheme: "light"
                }
            },
            kcBodyClass: {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary
            },
            kcFormCardClass: {}
        }) satisfies { [key in ClassKey]?: unknown }
);
