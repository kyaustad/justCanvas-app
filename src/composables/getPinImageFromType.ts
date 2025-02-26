import {
    pinRed,
    pinBlue,
    pinGray,
    pinGreen,
    pinBlack,
    pinYellow,
  } from '../assets/icons'

export function getPinImageFromType(PinType: string) {
    const pinMap: Record<string, string> = {
        'Not Interested': pinRed,
        "Not Home": pinGray,
        "No Knock": pinBlack,
        "Pitched": pinBlue,
        "Sale": pinGreen,
        "Go Back": pinYellow
    }

    return pinMap[PinType];
}