import * as os from 'os'
import { modifyState, getResource } from '../state'
import { deduceDocumentUrl } from './utils'

export function updateBodyClasses() {
    if (!document.body) {
        return
    }

    const loading = !!getResource('innerHTML') && !!getResource('metadata') && !!getResource('annotation')
    if (!loading) {
        document.body.classList.remove('loading')
    }

    const metadata = getResource('metadata')
    if (metadata) {
        const embeddable = metadata.embeddable ? 'content-embeddable' : 'content-not-embeddable'
        document.body.classList.add(embeddable)
    }

    if (os.platform() === 'darwin') {
        document.body.classList.add('os-mac')
    } else {
        document.body.classList.add('os-not-mac')
    }
}

export function replaceTitle() {
    const domainMatch = getResource('annotation').url.match(/https?:\/\/([^\/]+)\//)
    const domain = domainMatch[1]
    document.title = 'Memex Link: ' + domain
}

export function renderTemplate() {
    document.querySelector('body').innerHTML = replaceTemplateVars(getResource('annotationTemplate'))
    modifyState('replacedHTML', true)
}

export function injectIframeIfNeeded() {
    if (!getResource('metadata').embeddable) {
        return
    }

    const url = deduceDocumentUrl()
    const iframe = document.createElement('iframe')
    iframe.src = url
    document.querySelector('.iframe-container').appendChild(iframe)
}

function replaceTemplateVars(html) {
    html = html.replace('$TITLE$', getResource('metadata').title)
    html = html.replace('$URL$', getResource('annotation').url)
    html = html.replace('$QUOTE$', getResource('annotation').anchors[0].quote)
    return html 
}

export function truncateQuote() {
    const quoteCharLimit = 300

    const $quote = document.querySelector('.quote')
    const text = $quote.querySelector('.text-content').textContent
    if (text.length < quoteCharLimit) {
        return
    }

    const lastSpaceBeforeCutoff = text.lastIndexOf(' ', quoteCharLimit)
    const trunctatedText = text.substr(0, lastSpaceBeforeCutoff)

    $quote.classList.add('truncated')
    document.querySelector('.truncated-text .text-content').innerHTML = trunctatedText
}
