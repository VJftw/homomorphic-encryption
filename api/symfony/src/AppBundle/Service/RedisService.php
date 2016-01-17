<?php

namespace AppBundle\Service;

use JMS\Serializer\SerializerInterface;
use Predis\Client;

/**
 * Class RedisService
 * @package AppBundle\Service
 */
class RedisService
{

    /**
     * @var Client
     */
    private $client;

    /**
     * @var SerializerInterface
     */
    private $serializer;

    /**
     * @param $client
     * @param SerializerInterface $serializer
     */
    public function __construct(
        $client,
        SerializerInterface $serializer
    ) {
        $this->client = $client;
        $this->serializer = $serializer;
    }

    /**
     * @param $key
     * @param $object
     * @return $this
     */
    public function set($key, $object)
    {
        $jsonObject = $this->serializer->serialize($object, "json");

        $this->client->set($key, $jsonObject);

        return $this;
    }

    /**
     * @param $key
     * @return array|object
     */
    public function get($key)
    {
        $json = $this->client->get($key);

        if ($json) {
            return $this->serializer->deserialize($json, "", "json");
        }

        return null;
    }
}
