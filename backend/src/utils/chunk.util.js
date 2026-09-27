export const splitText = (

    text,

    size = 500

) => {

    const words = text.split(" ");

    const chunks = [];

    for (

        let i = 0;

        i < words.length;

        i += size

    ) {

        chunks.push(

            words

                .slice(

                    i,

                    i + size

                )

                .join(" ")

        );

    }

    return chunks;

};