<?php

namespace App\Http\Requests\swagger;

use Illuminate\Foundation\Http\FormRequest;

class SwaggerNewUrl extends FormRequest
{

    public function authorize()
    {
        return true;
    }


    public function rules()
    {
        return [
            'url'=>'required',
            'method'=>'required|in:get,post,put,delete',
            'tags'=>'array',
            'summary'=>'string'
        ];
    }
}
