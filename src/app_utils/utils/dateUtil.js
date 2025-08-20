export const getDayMonthYear = (date) => {
    const arr = date.split("/")
    return {
        year: Number(arr[2]),
        month: Number(arr[0]),
        day: Number(arr[1]),
    }
}


export const daysInMonth = (month) => {
    var days = 0
    switch (month) {
    case 1:
        days = 31
    case 2:
        days = 28
    case 3:
        days = 31
    case 4:
        days = 30
    case 5:
        days = 31
    case 6:
        days = 30
    case 7:
        days = 31
    case 8:
        days = 31
    case 9:
        days = 30
    case 10:
        days = 31
    case 11:
        days = 30
    case 12:
        days = 31
    }

    return days
}