# Visualforce

If you are using `ts-force` in an application running in VisualForce, obtaining an access token is simple:

{% tabs %}
{% tab title="app.page" %}
```markup
<apex:page showHeader="true" sidebar="false" standardStylesheets="false" docType="html-5.0">
    <script type="text/javascript">
        //rest details
        const __ACCESSTOKEN__ = '{!JSENCODE($Api.Session_ID})';
        const __RESTHOST__ = '{!JSENCODE(URLFOR("/", null)})';
    </script>
    <div id="root"></div>
</apex:page>
```
{% endtab %}

{% tab title="index.ts" %}
```typescript
// globals set via VF page
declare let __RESTHOST__: string;
declare let __ACCESSTOKEN__: string;

setDefaultConfig({
    accessToken: __ACCESSTOKEN__,
    instanceUrl: __RESTHOST__,
});
```
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
In order to make certain API request, you may need to add a `CORS Allowlist` entry for the VisualForce domain.
{% endhint %}

