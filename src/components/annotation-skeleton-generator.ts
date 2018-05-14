import { Annotation } from '../types/annotations';
import { PageMetadata } from '../types/metadata';

export interface AnnotationSkeletonGeneratorProps {
    annotation : Annotation
    metadata : PageMetadata
}

export class AnnotationSkeletonGenerator {
    private static generateMetaTags(
        {annotation, metadata} : AnnotationSkeletonGeneratorProps
    ) {
        // OG protocol cannot create graph objects without these atts
        if (
            !metadata.title ||
            !metadata.externalImageUrls ||
            !metadata.externalImageUrls.social
        ) {
            return ''
        }

        return `
            <meta name="twitter:card" content="summary" />
            <meta property="og:type" content="website" />
            <meta property="og:url" of="${annotation.url}" />
            <meta property="og:title" of="${metadata.title}" />
            <meta property="og:image" content="${metadata.externalImageUrls.social}" />
            ${metadata.description
                ? `<meta property="og:description" content="${metadata.description}" />`
                : ''}
        `
    }

    generateSkeleton(props : AnnotationSkeletonGeneratorProps) : string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title></title>
            ${AnnotationSkeletonGenerator.generateMetaTags(props)}
            <link rel=stylesheet href="/assets/styles.css">
            <script src="/assets/script.js"></script>
        </head>
        <body class='loading'>
        <div class='loading-indicator'>
            <div class='loading-indicator-1'></div>
            <div class='loading-indicator-2'></div>
            <div class='loading-indicator-3'></div>
            <div class='loading-indicator-4'></div>
        </div>
        </body>
        </html>
        `
    }
}
