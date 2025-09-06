jest.mock('dotenv/config', () => {})

const mockCreateClient = jest.fn()
jest.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient
}))

describe('Supabase configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('when environment variables are set correctly', () => {
    it('should create Supabase client with correct URL and key', async () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co'
      process.env.SUPABASE_ANON_KEY = 'test-anon-key'

      await import('./supabase.client')

      expect(mockCreateClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-anon-key'
      )
      expect(mockCreateClient).toHaveBeenCalledTimes(1)
    })
  })

  describe('when SUPABASE_URL is missing', () => {
    it('should throw error with correct message', async () => {
      process.env.SUPABASE_URL = ''
      process.env.SUPABASE_ANON_KEY = 'test-anon-key'

      await expect(async () => {
        await import('./supabase.client')
      }).rejects.toThrow('Missing Supabase environment variables: SUPABASE_URL')
    })

    it('should throw error when SUPABASE_URL is undefined', async () => {
      delete process.env.SUPABASE_URL
      process.env.SUPABASE_ANON_KEY = 'test-anon-key'

      await expect(async () => {
        await import('./supabase.client')
      }).rejects.toThrow('Missing Supabase environment variables: SUPABASE_URL')
    })
  })

  describe('when SUPABASE_ANON_KEY is missing', () => {
    it('should throw error with correct message', async () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co'
      process.env.SUPABASE_ANON_KEY = ''

      await expect(async () => {
        await import('./supabase.client')
      }).rejects.toThrow(
        'Missing Supabase environment variables: SUPABASE_ANON_KEY'
      )
    })

    it('should throw error when SUPABASE_ANON_KEY is undefined', async () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co'
      delete process.env.SUPABASE_ANON_KEY

      await expect(async () => {
        await import('./supabase.client')
      }).rejects.toThrow(
        'Missing Supabase environment variables: SUPABASE_ANON_KEY'
      )
    })
  })

  describe('edge cases', () => {
    it('should handle whitespace-only environment variables as missing', async () => {
      process.env.SUPABASE_URL = '   '
      process.env.SUPABASE_ANON_KEY = 'test-key'

      await expect(async () => {
        await import('./supabase.client')
      }).rejects.toThrow('Missing Supabase environment variables: SUPABASE_URL')
    })

    it('should work with valid URLs containing special characters', async () => {
      process.env.SUPABASE_URL = 'https://abc-123.supabase.co'
      process.env.SUPABASE_ANON_KEY =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'

      await import('./supabase.client')

      expect(mockCreateClient).toHaveBeenCalledWith(
        'https://abc-123.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
      )
    })
  })
})
