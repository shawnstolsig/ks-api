const { API_HOSTNAME_DEV, API_HOSTNAME  } = process.env;

const apiHostName = process.env.NODE_ENV === 'development' ? API_HOSTNAME_DEV : API_HOSTNAME;

module.exports = {
    apiHostName
}