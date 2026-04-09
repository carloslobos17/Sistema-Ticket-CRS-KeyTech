<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Exception;

class Status extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'name'
    ];

    public static function getDefaultId()
    {
        return self::where('name', 'en desarrollo')->value('id');

        if (!$status) {
            throw new \Exception('No existe el status por defecto');
        }

    return $status->id;
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }


}
