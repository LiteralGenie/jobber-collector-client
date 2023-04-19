import { sleep } from "./utils"
import { IndeedPostRaw } from "./models"

async function main() {
    let lastProcessed: string | null = null

    while (true) {
        const result = processPage()
        if (result && result.id !== lastProcessed) {
            console.log("Found new post", result)
            lastProcessed = result.id

            await fetch("http://localhost:8000/post", {
                method: "POST",
                body: JSON.stringify(result, undefined, 2),
            })
        }

        await sleep(1000)
    }
}

function processPage(): IndeedPostRaw | null {
    const detailsFrame = (
        document.querySelector(
            "iframe#vjs-container-iframe"
        ) as HTMLIFrameElement | null
    )?.contentDocument?.body
    const detailsPane = document.querySelector("#jobsearch-ViewjobPaneWrapper")
    const detailsEl = detailsFrame || detailsPane
    if (!detailsEl) return null

    const select = (sel: string) =>
        detailsEl.querySelector(sel) || document.querySelector(sel)

    const idEl = select(".vjs-highlight [data-jk]")
    if (!idEl) {
        console.error("No id found")
        return null
    }
    const id = (idEl as any).dataset.jk as string

    const titleEl = select(".jobsearch-JobInfoHeader-title-container span")
    if (!titleEl) {
        console.error("No title found")
        return null
    }
    const title = titleEl.textContent!.replace(/ - job post$/, "")

    const companyEl = select("[data-company-name]")
    if (!companyEl) {
        console.error("No company name found")
        return null
    }
    const company = companyEl.textContent as string

    const companyIdEl = companyEl.querySelector("a")
    let companyId
    if (companyIdEl) {
        const url = new URL(companyIdEl.href)
        companyId = url.pathname.split("/").at(-1)
    }

    const descriptionEl = select("#jobDescriptionText")
    if (!descriptionEl) {
        console.error("No description found")
        return null
    }
    const description = descriptionEl.textContent as string

    return {
        id,
        company,
        companyId,
        html: detailsEl.outerHTML,
        textContent: description,
        title,
    }
}

main()
