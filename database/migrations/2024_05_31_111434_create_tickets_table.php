<?php

use App\Enums\TicketPriorityStatusEnum;
use App\Enums\TicketStatusEnum;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->ulid("id");
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(User::class, "assigned_id")->nullable();
            $table->string("title");
            $table->integer("priority")->default(TicketPriorityStatusEnum::low);
            $table->integer("rate")->default(0);
            $table->string("feedback")->nullable();
            $table->integer("status")->default(TicketStatusEnum::pending);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
