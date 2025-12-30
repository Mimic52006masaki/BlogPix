import { POST } from './route'
import axios from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock Response
global.Response = {
  json: jest.fn().mockImplementation((data, options) => ({
    json: jest.fn().mockResolvedValue(data),
    status: options?.status || 200,
  })),
} as any

describe('/api/fetch-images', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return images from valid URLs', async () => {
    const mockHtml = `
      <html>
        <body>
          <img src="/image1.jpg" />
          <img src="https://example.com/image2.png" />
          <img src="/ads/banner.jpg" />
        </body>
      </html>
    `
    mockedAxios.get.mockResolvedValue({ data: mockHtml })

    const request = {
      json: jest.fn().mockResolvedValue({ urls: ['https://example.com'] })
    } as unknown as Request

    const response = await POST(request)
    const result = await response.json()

    expect(mockedAxios.get).toHaveBeenCalledWith('https://example.com')
    expect(result.images).toHaveLength(2)
    expect(result.images[0]).toEqual({
      id: 'img-0',
      url: 'https://example.com/image1.jpg',
      width: 800,
      height: 600,
      format: 'jpg'
    })
  })

  it('should exclude ad images', async () => {
    const mockHtml = `
      <html>
        <body>
          <img src="/image1.jpg" />
          <img src="/ads/image.jpg" />
          <img src="/banner.jpg" />
        </body>
      </html>
    `
    mockedAxios.get.mockResolvedValue({ data: mockHtml })

    const request = {
      json: jest.fn().mockResolvedValue({ urls: ['https://example.com'] })
    } as unknown as Request

    const response = await POST(request)
    const result = await response.json()

    expect(result.images).toHaveLength(1)
    expect(result.images[0].url).toBe('https://example.com/image1.jpg')
  })

  it('should return error on failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'))

    const request = {
      json: jest.fn().mockResolvedValue({ urls: ['https://invalid.com'] })
    } as unknown as Request

    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(500)
    expect(result.error).toBe('Failed to fetch images')
  })

  it('should handle multiple URLs', async () => {
    const mockHtml1 = `<html><body><img src="/image1.jpg" /></body></html>`
    const mockHtml2 = `<html><body><img src="/image2.png" /></body></html>`
    mockedAxios.get.mockImplementation((url) => {
      if (url === 'https://site1.com') return Promise.resolve({ data: mockHtml1 })
      if (url === 'https://site2.com') return Promise.resolve({ data: mockHtml2 })
      return Promise.reject(new Error('Unexpected URL'))
    })

    const request = {
      json: jest.fn().mockResolvedValue({ urls: ['https://site1.com', 'https://site2.com'] })
    } as unknown as Request

    const response = await POST(request)
    const result = await response.json()

    expect(mockedAxios.get).toHaveBeenCalledTimes(2)
    expect(result.images).toHaveLength(2)
    expect(result.images[0].url).toBe('https://site1.com/image1.jpg')
    expect(result.images[1].url).toBe('https://site2.com/image2.png')
  })

  it('should return error for invalid input', async () => {
    const request = {
      json: jest.fn().mockResolvedValue({ urls: [] })
    } as unknown as Request

    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(400)
    expect(result.error).toBe('URLs must be a non-empty array')
  })
})