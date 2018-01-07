/**
 * Created by leeweijie on 29/7/2016.
 */
import rest from 'rest'
import pathPrefix from 'rest/interceptor/pathPrefix'
import mime from 'rest/interceptor/mime'
import errorCode from 'rest/interceptor/errorCode'

let client = rest
    .wrap(errorCode)
    .wrap(mime, { mime: 'application/json' })
    .wrap(pathPrefix, {prefix: 'https://plutuskek.appspot.com/_ah/api/plutusapi/v1'});

export const request = (path, entity) => {
    return client({
        path,
        entity
    })
};