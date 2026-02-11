<?php


use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

if (!function_exists('upload_file')) {
    /**
     * @param UploadedFile $file
     * @param string $directory
     * @return string
     */
    function upload_file(UploadedFile $file, string $directory): string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid() . '.' . $extension;

        Storage::disk('public')->putFileAs($directory, $file, $filename);

        return "/storage/$directory/$filename";
    }
}

if (!function_exists('remove_file')) {
    /**
     * @param string $filePath
     * @return bool
     */
    function remove_file(string $filePath): bool
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            return Storage::disk('public')->delete($filePath);
        }

        return false;
    }
}
