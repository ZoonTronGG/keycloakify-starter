# Akzhol Keycloak theme — READ THIS FIRST

> **Каноническая ветка: `akzhol-email-theme`** (default). Здесь живёт продовый дизайн
> логина Akzhol (зелёная карточка, A-truck лого, чёрный Apple / белый Google) И email-тема.
> Ветки `main`, `akzhol-login-page`, `akzhol-login-page-fixed` — УСТАРЕЛИ; `-fixed` в имени
> врёт (там баг `name="email"`, ронявший все password-логины — prod-инцидент 2026-07-08).
>
> **Как менять тему** (инцидент 2026-07-09: дизайн жил только в jar, исходник не был закоммичен —
> пересборка молча откатила вид; НЕ повторять):
> 1. Правки → коммит → push СЮДА (в `akzhol-email-theme`) — до вендоринга jar.
> 2. `./scripts/vendor-to-akzhol-rust.sh` — соберёт jar (откажется на грязном дереве)
>    и скопирует в `akzhol-rust/custom-keycloak-themes/`.
> 3. В akzhol-rust: коммит jar с `Source: ZoonTronGG/keycloakify-starter@<sha>` в месседже,
>    push `development` (дев катится сам); merge в `production` — прод.
> 4. Прод-вид проверять локально ДО пуша: `docker build -f docker/keycloak/Dockerfile` в akzhol-rust
>    + `docker run … -v keycloak/realm-export.json:/opt/keycloak/data/import/realm-export.json:ro
>    <img> start-dev --import-realm` (гоча: resetPasswordAllowed в export=false, включать kcadm'ом).
>
> Keycloak-инвариант: поле логина обязано POSTить `name="username"` (как бы ни называлось визуально),
> ошибки полей Keycloak вешает на `username`/`password` — биндить existsError туда.
> Постмортемы: vault `40-retros/2026-07-08-*`, `2026-07-09-*`.

<p align="center">
    <i>🚀 <a href="https://keycloakify.dev">Keycloakify</a> v11 starter 🚀</i>
    <br/>
    <br/>
</p>

# Quick start

```bash
git clone https://github.com/keycloakify/keycloakify-starter
cd keycloakify-starter
yarn install # Or use an other package manager, just be sure to delete the yarn.lock if you use another package manager.
```

# Testing the theme locally

[Documentation](https://docs.keycloakify.dev/testing-your-theme)

# How to customize the theme

[Documentation](https://docs.keycloakify.dev/customization-strategies)

# Building the theme

You need to have [Maven](https://maven.apache.org/) installed to build the theme (Maven >= 3.1.1, Java >= 7).  
The `mvn` command must be in the $PATH.

-   On macOS: `brew install maven`
-   On Debian/Ubuntu: `sudo apt-get install maven`
-   On Windows: `choco install openjdk` and `choco install maven` (Or download from [here](https://maven.apache.org/download.cgi))

```bash
npm run build-keycloak-theme
```

Note that by default Keycloakify generates multiple .jar files for different versions of Keycloak.  
You can customize this behavior, see documentation [here](https://docs.keycloakify.dev/targeting-specific-keycloak-versions).

# Initializing the account theme

```bash
npx keycloakify initialize-account-theme
```

# Initializing the email theme

```bash
npx keycloakify initialize-email-theme
```

# GitHub Actions

The starter comes with a generic GitHub Actions workflow that builds the theme and publishes
the jars [as GitHub releases artifacts](https://github.com/keycloakify/keycloakify-starter/releases/tag/v10.0.0).  
To release a new version **just update the `package.json` version and push**.

To enable the workflow go to your fork of this repository on GitHub then navigate to:
`Settings` > `Actions` > `Workflow permissions`, select `Read and write permissions`.
