import { useCallback } from 'react';

export const useInputSanitizer = () => {
  // Basic text sanitization
  const sanitizeText = useCallback((input: string): string => {
    return input
      .trim()
      .replace(/[<>"']/g, '') // Remove HTML tags and quotes
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/[\u0000]/g, '') // Remove null bytes
      .substring(0, 1000); // Limit length
  }, []);

  // Name sanitization (allows letters, spaces, hyphens, apostrophes)
  const sanitizeName = useCallback((name: string): string => {
    return name
      .trim()
      .replace(/[^a-zA-Z\s\u1200-\u137F'-]/g, '') // Allow English, Amharic, spaces, hyphens, apostrophes
      .replace(/\s+/g, ' ') // Normalize multiple spaces
      .substring(0, 100);
  }, []);

  // Email sanitization
  const sanitizeEmail = useCallback((email: string): string => {
    return email
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9@._+-]/g, '') // Only allow valid email characters
      .substring(0, 255);
  }, []);

  // Phone sanitization
  const sanitizePhone = useCallback((phone: string): string => {
    return phone
      .replace(/[^\d+\s()-]/g, '') // Allow digits, +, spaces, parentheses, hyphens
      .replace(/\s+/g, '') // Remove all spaces
      .substring(0, 20);
  }, []);

  // Username sanitization
  const sanitizeUsername = useCallback((username: string): string => {
    return username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '') // Only allow alphanumeric, dots, underscores, hyphens
      .substring(0, 50);
  }, []);

  // Password sanitization (minimal - preserve special chars but remove dangerous ones)
  const sanitizePassword = useCallback((password: string): string => {
    return password
      .replace(/[\u0000-\u001F\u007F]/g, '') // Remove control characters
      .replace(/[<>"']/g, '') // Remove HTML-dangerous characters
      .substring(0, 128);
  }, []);

  // Subject/Class code sanitization
  const sanitizeCode = useCallback((code: string): string => {
    return code
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '') // Only allow uppercase letters and numbers
      .substring(0, 20);
  }, []);

  // Description/Message sanitization (allows more characters but removes dangerous ones)
  const sanitizeDescription = useCallback((description: string): string => {
    return description
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/[\u0000]/g, '') // Remove null bytes
      .substring(0, 5000);
  }, []);

  // File name sanitization
  const sanitizeFileName = useCallback((fileName: string): string => {
    return fileName
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace invalid chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .substring(0, 255);
  }, []);

  // URL sanitization
  const sanitizeUrl = useCallback((url: string): string => {
    return url
      .trim()
      .replace(/[<>"'\s]/g, '') // Remove dangerous characters and spaces
      .substring(0, 2048);
  }, []);

  // Number sanitization
  const sanitizeNumber = useCallback((input: string): number => {
    const cleaned = input.replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }, []);

  // Grade sanitization (9-12 only)
  const sanitizeGrade = useCallback((grade: string): string => {
    const cleaned = grade.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned);
    if (num >= 9 && num <= 12) return num.toString();
    return '';
  }, []);

  // Section sanitization (A-Z only)
  const sanitizeSection = useCallback((section: string): string => {
    return section
      .trim()
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .substring(0, 1);
  }, []);

  return {
    sanitizeText,
    sanitizeName,
    sanitizeEmail,
    sanitizePhone,
    sanitizeUsername,
    sanitizePassword,
    sanitizeCode,
    sanitizeDescription,
    sanitizeFileName,
    sanitizeUrl,
    sanitizeNumber,
    sanitizeGrade,
    sanitizeSection,
  };
};