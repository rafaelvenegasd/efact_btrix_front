export interface BitrixUser {
  id: string
  name: string
  email: string
}

export interface BitrixContext {
  dealId?: string
  contactId?: string
  companyId?: string
  userId?: string
  domain?: string
}

export interface BitrixPlacementOptions {
  dealId?: string
  [key: string]: unknown
}
