export const typeCardImage = ['full', 'head', undefined] as const
export const typeStatusToast = ['DEFAULT', 'INFO', 'SUCCESS', 'ERROR', 'WARNING'] as const
export const typeVariant = ['tonal', 'flat', 'text', 'elevated', 'outlined', 'plain', undefined] as const
export enum typeCardImageEnum {
  full, head, undefined,
}
export enum TYPE_REQUEST {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
export const size = ['x-small', 'small', 'default', 'large', 'x-large'] as const
export const sizeDialog = ['sm', 'lg', 'xl'] as const
declare const block: readonly ['top', 'bottom']
declare const inline: readonly ['start', 'end', 'left', 'right']
declare type Tblock = typeof block[number]
declare type Tinline = typeof inline[number]
export type Anchor = Tblock | Tinline | 'center' | 'center center' | `${Tblock} ${Tinline | 'center'}` | `${Tinline} ${Tblock | 'center'}`
export const typeTab = ['button', 'underline'] as const
export const typeLoading = ['FULL', 'COMPONENT', 'FULL-OPACITY', 'COMPONENT-OPACITY', null] as const
export const typeSkeleton = [
  'BulletListLoader',
  'CodeLoader',
  'ContentLoader',
  'FacebookLoader',
  'InstagramLoader',
  'ListLoader',
] as const
