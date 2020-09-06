# Ayasofya-swagger-generator
A simple tool for laravel projects to avoiding suffering from indent errors in swagger.yaml file
# Requirements
 - PHP YAML 
# Installaion
After createing and configuring swagger.yml :
 - in your laravel project root directory  `/public` folder clone the tool via `git clone https://github.com/ahmedsabry1996/ayasofya-swagger-generator.git`
 - Copy `SwaggerController.php` where your controllers locate.
 - Copy `SwaggerNewUrl.php` to `Request/swagger` folder
 - In index.js file edit `appUrl` property by default it's `http://127.0.0.1:8000/`
 - Create routes in  **api.php**  :
    - `Route::prefix('swagger-generator')->group(function(){
    Route::get('/', 'SwaggerController@index');
    Route::post('/', 'SwaggerController@addUrl');
});`
 - Run `composer dump-autoload`
# Note :
 - If swagger.yml file located out of /public/swagger/ folder you must change it in `SwaggerController.php` file by editng this line `$swagger_yml_file = public_path()."/swagger/swagger.yml";` 
` 
# Usage
 - Access to `http://app-url/ayasofya-swagger-generator` and start adding urls.
