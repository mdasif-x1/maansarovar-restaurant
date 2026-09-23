package com.maansarovar.restaurant.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

public class ImageValidationUtils {

    public static String validateAndDetectFormat(MultipartFile file) {
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[12];
            int bytesRead = is.read(header);
            if (bytesRead < 4) {
                throw new IllegalArgumentException("File header is corrupted or too short.");
            }

            // Check JPEG (FF D8 FF)
            if ((header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 && (header[2] & 0xFF) == 0xFF) {
                return ".jpg";
            }

            // Check PNG (89 50 4E 47)
            if ((header[0] & 0xFF) == 0x89 && header[1] == 'P' && header[2] == 'N' && header[3] == 'G') {
                return ".png";
            }

            // Check WebP (RIFF....WEBP)
            if (bytesRead >= 12 &&
                header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F' &&
                header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P') {
                return ".webp";
            }

            throw new IllegalArgumentException("Invalid file format. Only JPEG, PNG, and WebP images are allowed.");

        } catch (IOException e) {
            throw new IllegalArgumentException("Unable to inspect file headers.", e);
        }
    }
}
