addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
    return Response.redirect(
        "https://replit.com/auth_with_repl_site?domain=replit.ma1ted.workers.dev", 
        301
    );
}
