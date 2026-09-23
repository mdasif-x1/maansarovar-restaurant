package com.maansarovar.restaurant.service;

import com.maansarovar.restaurant.dto.UploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
    UploadResponse storeImage(MultipartFile file);
    void deleteImage(String filename);
}
