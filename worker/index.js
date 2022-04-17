const PAGE = (messagePayload) => { return `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>ReplitAuth Success</title>
        <style>
            html{
                height: 100vh;
                overflow: hidden;
                font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
                background-color: #18181B
            }
            body{
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                gap: 2rem
            }
            h1{
                color: #ddd6fe;
                text-shadow: 0 0 1.5rem #7c3aed;
                font-size: 3.75rem;
                line-height: 1
            }
            h3{
                text-shadow: 0 0 .5rem #8B5CF6;
            }
            h2,h3{
                color: #ddd6fe;
                font-size: 1.25rem;
                line-height: 1.75rem
            }
            a{
                text-shadow: 0 0 1.5rem #7c3aed;
                color: #c4b5fd;
                font-size: 1.875rem;
                line-height: 2.25rem;
                text-decoration: none
            }
            h3:after {
                content: "` + "\\00a0\\00a0\\00a0" + 
                /* For some reason you can't have octal escapes in interpolated strings? */
                `";
                animation:  dots .5s infinite
            }
            @keyframes dots {
                0% {
                    content: "` + "\\00a0\\00a0\\00a0" + `"
                }
                30% {
                    content: ".` + "\\00a0\\00a0" + `"
                }
                60% {
                    content: "..` + "\\00a0" + `"
                }
                90% {
                    content: "..."
                }
            }
        </style>
        <script>
            window.opener.postMessage(JSON.stringify(${JSON.stringify(messagePayload)}),"https://authtest.malted.repl.co");
        </script>
    </head>
    <body>
        <h1>Authorised!</h1>
        <h2>You have been authorised by <a href="https://github.com/ma1ted">ReplitAuth</a></h2>
        <h3>Redirecting back to your application</h3>
    </body>
</html>
`};

function parseJwt(token) {
	const base64Url = token.split(".")[1];
	const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	const jsonPayload = decodeURIComponent(
		atob(base64)
			.split("")
			.map((c) => {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join("")
	);

	return JSON.parse(jsonPayload);
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {
	const url = new URL(request.url);
	if (url.pathname === "/__replauth") {
		const token = url.searchParams.get("token");
		let json;
		try {
			json = parseJwt(token);
		} catch (e) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Invalid JWT supplied",
				})
			);
		}

    const sessionToken = crypto.randomUUID();

		const messagePayload = {
			success: true,
      sessionToken,
      replit: {
        name: json.name,
        uid: json.sub,
        roles: json.roles,
        teams: json.teams,
      }
		};

    fetch("https://db.replitauth.com/auth?secret=" + SECRET_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((err) => {
        console.error(err)
      return new Response({
        success: false,
        error: "There was an error while trying to reach the users database."
      });
    });

    console.log(2)

		return new Response(PAGE(messagePayload), {
		  headers: {
				"content-type": "text/html;charset=UTF-8",
			},
		});
	} else {
        console.log(123)
		return new Response(
			JSON.stringify({
				success: false,
				error: "This URL should be automatically accessed during the authentication flow.",
			})
		);
	}
}
