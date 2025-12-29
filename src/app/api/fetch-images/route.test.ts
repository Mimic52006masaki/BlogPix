import { POST } from './route'
import axios from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('/api/fetch-images', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return images from a valid URL', async () => {
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
      json: jest.fn().mockResolvedValue({ url: 'https://example.com' })
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
      json: jest.fn().mockResolvedValue({ url: 'https://example.com' })
    } as unknown as Request

    const response = await POST(request)
    const result = await response.json()

    expect(result.images).toHaveLength(1)
    expect(result.images[0].url).toBe('https://example.com/image1.jpg')
  })

  it('should return error on failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'))

    const request = {
      json: jest.fn().mockResolvedValue({ url: 'https://invalid.com' })
    } as unknown as Request

    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(500)
    expect(result.error).toBe('Failed to fetch images')
  })
})