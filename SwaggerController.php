<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\swagger\SwaggerNewUrl;
use Illuminate\Http\Request;

class SwaggerController extends Controller
{

    public function loadSwaggerYamlFile()
    {
        $swagger_yml_file = public_path()."/swagger/swagger.yml";

        $read_swagger_yml = yaml_parse_file($swagger_yml_file);

        return ['swagger_file'=>$swagger_yml_file, 'swagger_yml'=>$read_swagger_yml];
    }
    public function index()
    {

        $paths = array_keys($this->loadSwaggerYamlFile()['swagger_yml']['paths']);

        return response()->json(['urls'=> $paths]);
    }

    public function addUrl(SwaggerNewUrl $request)
    {

        $swagger_yml_file = $this->loadSwaggerYamlFile()['swagger_file'];

        $read_swagger_yml = $this->loadSwaggerYamlFile()['swagger_yml'];

        $read_swagger_yml_paths = collect($read_swagger_yml['paths']);

        $read_swagger_yml_paths->put($request->url, [
                $request->method=>$this->url_template($request->tags,
                $request->parameters,
                $request->requestBody,
                $request->summary)
        ]);

        $read_swagger_yml_paths = $read_swagger_yml_paths->toArray();

        $read_swagger_yml['paths'] = $read_swagger_yml_paths;

        $create_url = yaml_emit_file($swagger_yml_file,$read_swagger_yml);

        return $create_url ? response()->json(['success'=>'error in creating url'] , 200) : response()->json(['error'=>'error in creating url'] , 422);
    }

    public function url_template($tags, $parameters=null, $request_body=null, $summary)
    {
        if ($request_body){
            $request_body = collect($request_body)->keyBy('name')->transform(function($v){
                    unset($v['name']);
                return $v;
            });

        }

         return $template = collect([
                    'tags' => $tags,
                    'parameters' => count($parameters) == 0 ? null : array_map(function($val){
                        return $val;
                    },$parameters) ,
                    'requestBody'=>$request_body ? [
                        'content'=>[
                            'application/json'=>[
                                'schema'=>[
                                    'type'=>'object',
                                    'properties'=> $request_body->toArray()
                                ]
                            ]
                        ]
                    ] : null,
                    'summary' => $summary,
                    'responses' => ['200'=>['$refs'=>'#/components/responses/Default']]
        ])->filter(function($val){
            return $val != null;
            return $val;
        })->toArray();

    }

}
