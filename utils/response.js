function flashRedirect(res, destination, key, message) {
    return res.redirect(`${destination}?${key}=${encodeURIComponent(message)}`);
}

module.exports = { flashRedirect };
