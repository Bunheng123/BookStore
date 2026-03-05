<?php
namespace App\Helpers;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use RuntimeException;

class JwtToken{
    private static function secret(): string{
        return getenv('JWT_SECRET') ?: $_ENV['JWT_SECRET'];
    }
    public static function generate(array $payload, int $expiresIn = 3600): string{
        $payload['exp'] = time() + $expiresIn;
        try {
            return JWT::encode($payload, self::secret(), 'HS256');
        } catch (\Exception $e) {
            throw new RuntimeException('Error generating JWT: ' . $e->getMessage());
        }
    }
    public static function decode(string $token): ?array
    {
        try {
            return (array) JWT::decode(
                $token, 
                new Key(self::secret(), 'HS256')
            );
        } catch (\Throwable $e) {
            return null;
        }
    }    
}