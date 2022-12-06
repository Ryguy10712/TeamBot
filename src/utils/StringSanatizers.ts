export function isoculusidClean(oculusid: string): boolean {
    const CHAR_LIMIT = 30
    const CHAR_MIN = 3
    if(oculusid.length > CHAR_LIMIT || oculusid.length < CHAR_MIN) return false
    const regex = new RegExp("^[a-zA-Z0-9._]*$")
    return regex.test(oculusid)
}

