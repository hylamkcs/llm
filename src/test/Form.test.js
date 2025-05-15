import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import FormComponent from '../component/FormComponent';

jest.mock('@react-google-maps/api', () => ({
  Autocomplete: ({ children, onLoad }) => {
    const { useEffect } = require('react');

    useEffect(() => {
        if (onLoad) onLoad(); // Call onLoad if it exists
    }, [onLoad]);

    return <div>{children}</div>;
  },
}));

jest.mock('../data/data.json', () => ({
  MOCK_API: 'http://mock-api',
}));

global.fetch = jest.fn();

const setStartPoint = jest.fn();
const setEndPoint = jest.fn();
const setPath = jest.fn();

beforeEach(() => {
  fetch.mockClear();
  setStartPoint.mockClear();
  setEndPoint.mockClear();
  setPath.mockClear();
});

it('renders form elements and allows input', () => {
  render(<FormComponent {...{ setStartPoint, setEndPoint, setPath }} />);
  
  const startInput = screen.getByPlaceholderText('Enter Origin*');
  const endInput = screen.getByPlaceholderText('Enter Destination*');
  
  fireEvent.change(startInput, { target: { value: 'Hong Kong' } });
  fireEvent.change(endInput, { target: { value: 'Wan Chai' } });

  expect(startInput.value).toBe('Hong Kong');
  expect(endInput.value).toBe('Wan Chai');
  expect(screen.getByText('Submit')).toBeInTheDocument();
  expect(screen.getByText('Reset')).toBeInTheDocument();
});

it('handles form submission and displays results', async () => {
  fetch
    .mockResolvedValueOnce({ json: () => ({ token: 'test-token' }) }) // POST
    .mockResolvedValueOnce({ json: () => ({ // GET
      status: 'success', total_distance: 1000, total_time: 3600, path: []
    })});

  render(<FormComponent {...{ setStartPoint, setEndPoint, setPath }} />);
  
  fireEvent.change(screen.getByPlaceholderText('Enter Origin*'), { target: { value: 'Hong Kong' } });
  fireEvent.change(screen.getByPlaceholderText('Enter Destination*'), { target: { value: 'Wan Chai' } });
  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('http://mock-api/route', expect.any(Object));
    expect(fetch).toHaveBeenCalledWith('http://mock-api/route/test-token', expect.any(Object));
  });

  expect(await screen.findByText('Total distance: 1000')).toBeInTheDocument();
  expect(await screen.findByText('Total time: 3600')).toBeInTheDocument();
});

it('displays error on API failure for /route', async () => {
  fetch.mockRejectedValue(new Error('API Error'));

  render(<FormComponent {...{ setStartPoint, setEndPoint, setPath }} />);
  
  fireEvent.click(screen.getByText('Submit'));
  expect(await screen.findByText('Error exists. Please try again.')).toBeInTheDocument();
});

it('resets form inputs and state', () => {
  render(<FormComponent {...{ setStartPoint, setEndPoint, setPath }} />);
  
  const startInput = screen.getByPlaceholderText('Enter Origin*');
  const endInput = screen.getByPlaceholderText('Enter Destination*');

  fireEvent.change(startInput, { target: { value: 'Hong Kong' } });
  fireEvent.change(endInput, { target: { value: 'Wan Chai' } });
  fireEvent.click(screen.getByText('Reset'));

  expect(startInput.value).toBe('');
  expect(endInput.value).toBe('');
  expect(setStartPoint).toHaveBeenCalledWith(null);
  expect(setEndPoint).toHaveBeenCalledWith(null);
  expect(setPath).toHaveBeenCalledWith(null);
});

it('retries on in-progress status', async () => {
  fetch
    .mockResolvedValueOnce({ json: () => ({ token: 'token1' }) }) // POST 1
    .mockResolvedValueOnce({ json: () => ({ status: 'in progress' }) }) // GET 1
    .mockResolvedValueOnce({ json: () => ({ token: 'token2' }) }) // POST 2
    .mockResolvedValueOnce({ json: () => ({ // GET 2
      status: 'success', total_distance: 2000, total_time: 7200, path: []
    })});

  render(<FormComponent {...{ setStartPoint, setEndPoint, setPath }} />);
  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(4));
  expect(await screen.findByText('Total distance: 2000')).toBeInTheDocument();
});

it('display error on failure status on /route/token', async () => {
  fetch
    .mockResolvedValueOnce({ json: () => ({ token: 'token1' }) }) // POST
    .mockResolvedValueOnce({ json: () => ({ status: 'failure', "error": "Location not accessible by car" }) }) // GET 

  render(<FormComponent {...{ setStartPoint, setEndPoint, setPath }} />);
  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  expect(await screen.findByText('Location not accessible by car')).toBeInTheDocument();
});

it('displays error on API failure for /route/token', async () => {
  fetch
    .mockResolvedValueOnce({ json: () => ({ token: 'token1' }) }) // Post
    .mockRejectedValue(new Error('API Error')); // Get

  render(<FormComponent {...{ setStartPoint, setEndPoint, setPath }} />);
  
  fireEvent.click(screen.getByText('Submit'));
  expect(await screen.findByText('Error exists. Please try again.')).toBeInTheDocument();
});
