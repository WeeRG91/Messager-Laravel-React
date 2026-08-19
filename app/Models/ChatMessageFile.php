<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatMessageFile extends Model
{
    use HasUuids;

    protected $guarded = ['id'];
    protected $hidden = ['deleted_in_id'];

    public function sent_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sent_by_id')
            ->selectRaw(
                'id, CASE WHEN id = ? THEN "You" ELSE name END as name, avatar',
                [auth()->id()]
            );
    }

    public function scopeDeletedInIds(Builder $query): void
    {
        $query->where(function (Builder $query) {
            $query->whereNull('deleted_in_id')
                ->orWhereRaw("
                NOT EXISTS (
                    SELECT 1
                    FROM json_each(deleted_in_id)
                    WHERE json_extract(json_each.value, '$.id') = ?
                )
            ", [auth()->id()]);
        });
    }
}
