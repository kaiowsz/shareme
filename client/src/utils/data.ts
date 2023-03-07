export const userQuery = (userId: string) => {
    const query = `*[_type == "user" && _id == '${userId}']`;

    return query
}

export const searchQuery = (searchTerm: string) => {
    const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match ]{
        image {
            asset -> {
                url
            }
        },
        _id,
        destination,
        postedBy -> {
            _id,
            username,
            image,
        },
        save[] {
            _key,
            postedBy -> {
                _id,
                username,
                image
            },
        },
    }`

    return query
}

export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
    
}`