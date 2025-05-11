import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

//TODO:preloadからlocaleが取得できるようにする
const locale = window.context?.locale || 'ja-JP'

const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'UTC',
})

export const formatDateFromMs = (ms: number) => dateFormatter.format(ms)

export const cn = (...args: ClassValue[]) => {
    return twMerge(clsx(...args))
}