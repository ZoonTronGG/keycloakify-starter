<#--
  This file has been claimed for ownership from @keycloakify/email-native version 260007.0.0.
  To relinquish ownership and restore this file to its original content, run the following command:

  $ npx keycloakify own --path 'email/html/template.ftl' --revert

  Akzhol branded email layout. Shared by every html/*.ftl template via
  <@layout.emailLayout>. Table-based with inline styles on purpose — email
  clients (Outlook, Gmail, Mail.ru) ignore <style> blocks and flexbox. No
  remote images: a text wordmark renders everywhere, needs no hosting and
  never trips image-blocking. Brand colors mirror the login theme
  (#4CAF50 primary / #388E3C dark green).
-->

<#macro emailLayout>
<html>
<head>
    <meta charset="utf-8">
    <#-- Without a viewport meta, mobile mail clients render the email in a
         ~980px desktop viewport and scale it down — everything looks tiny and
         needs pinch-zoom (reported on the first dev test send, 2026-07-08). -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f5f7;">
        <tr>
            <td align="center" style="padding:24px 12px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
                    <tr>
                        <td style="background-color:#388E3C;border-radius:12px 12px 0 0;padding:20px 32px;" align="center">
                            <span style="font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Akzhol</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#ffffff;border-radius:0 0 12px 12px;padding:32px;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1c1f23;">
                            <#nested>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding:20px 32px 0 32px;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#6b7280;">
                            Akzhol&nbsp;&middot;&nbsp;<a href="https://akzholapp.kz" style="color:#388E3C;text-decoration:none;">akzholapp.kz</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
</#macro>
