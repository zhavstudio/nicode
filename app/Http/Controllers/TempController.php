<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTemporaryFileRequest;
use App\Models\TemporaryFile;
use App\Models\TemporaryFiles;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class TempController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->file("audio")){
            $file = $request->file("audio");
        }else{
            $file = $request->file("file");
        }
        $filename = time() . "-" . auth()->user()->id . "-" . (auth()->user()->fname ?? "") . "-" . (auth()->user()->lname ?? "") . "." . $file->extension();
        $save = Storage::put("/public/tmp-files/{$filename}", file_get_contents($file));
        if ($save) {
            $tempFileObj = TemporaryFile::create(['name' => $filename,
                                                   "type" => $file->getClientMimeType(),
                                                   "size" => $file->getSize()]);
            return response($tempFileObj->id, 200, ['content-type' => 'text/plain']);
        }
        return abort("403", "The file has not saved.");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
