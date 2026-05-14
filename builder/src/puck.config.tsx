import type {Config} from "@puckeditor/core";

export const config: Config = {
    categories: {
        text: {
            title: "Texte",
            defaultExpanded: false,
            components: ["Heading", "Text"],
        },
        media: {
            title: "Média",
            defaultExpanded: false,
            components: ["Image"],
        },
    },
    components: {
        Heading: {
            label: "Titre",
            fields: {
                title: {
                    type: "text",
                },
            },
            defaultProps: {
                title: "Test"
            },
            render: ({ title }) => {
                return <h1>{title}</h1>;
            },
        },
        Text: {
            label: "Paragraphe",
            fields: {
                content: {
                    type: "textarea",
                },
            },
            render: ({ content }) => {
                return <p>{content}</p>;
            },
        },
        Image: {
            label: "Image",
            fields: {
                src: {
                    type: "text",
                },
                alt: {
                    type: "text",
                },
            },
            render: ({ src, alt }) => {
                return <img alt={alt} src={src} />;
            },
        },
    },
};