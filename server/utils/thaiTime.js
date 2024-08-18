function ConvertToThaiTime(params) {
    const thaiTimeOffset = 7 * 60 * 60 * 1000; 

    const utcTime = params.getTime();

    const thaiTime = new Date(utcTime + (thaiTimeOffset));

    return thaiTime;
}

export { ConvertToThaiTime }