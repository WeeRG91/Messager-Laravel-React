<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ChatMessage extends Model
{
    use HasUuids;

    protected $guarded = ['id'];
    protected $hidden = ['deleted_in_id', 'seen_in_id'];

    public const CHATS = 'chats';
    public const GROUP_CHATS = 'group_chats';

    public function from(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_id');
    }

    public function to(): MorphTo
    {
        return $this->morphTo();
    }

    public function another_user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'another_user_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(ChatMessageFile::class, 'chat_id');
    }

    /**
     * Bootstrap the model and its traits.
     *
     * @return void
     */
    protected static function boot(): void
    {
        parent::boot();

        static::addGlobalScope('default_sort', function (Builder $builder) {
           $builder->orderBy('sort_id');
        });

        static::creating(function ($model) {
           $model->sort_id = static::max('sort_id') + 1;
           $model->seen_in_id = json_encode([['id' => auth()->id(), 'seen_at' => now()]]);
        });
    }

    public function scopeForUserOrGroup(Builder $query, string $id): void
    {
        $query->where(function (Builder $query) use ($id) {
                $query->where('from_id', auth()->id())
                    ->where('to_id', $id);
            })
            ->orWhere(function (Builder $query) use ($id) {
                $query->where('from_id', $id)
                    ->where('to_id', auth()->id());
            });
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

    public function scopeNotSeen(Builder $query): void
    {
        $query->whereRaw("
                NOT EXISTS (
                    SELECT 1
                    FROM json_each(seen_in_id)
                    WHERE json_extract(json_each.value, '$.id') = ?
                )
            ", [auth()->id()]
        );
    }
}
