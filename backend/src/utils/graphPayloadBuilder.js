const graphPayloadBuilder = (data) => {

    return {

        name:
            data.name,

        category:
            data.category,

        language:
            data.language,

        components:
            data.components

    };
};

export default graphPayloadBuilder;