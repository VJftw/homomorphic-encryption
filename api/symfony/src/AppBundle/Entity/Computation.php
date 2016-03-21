<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Computation
 *
 * @ORM\Table(
 *      indexes={
 *          @ORM\Index(name="idx_computation_hashid", columns={"hashid"})
 *      }
 * )
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ComputationRepository")
 */
class Computation
{

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="hashid", type="string", length=10)
     */
    private $hashId;

    /**
     * @var string
     *
     * @ORM\Column(name="encryption_scheme", type="string", length=255)
     */
    private $encryptionScheme;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="timestamp", type="datetime")
     */
    private $timestamp;

    /**
     * @var String
     *
     * @ORM\Column(name="ip_address", type="string", length=15)
     */
    private $ipAddress;

    /**
     * @var String
     */
    private $authToken;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param $hashId
     *
     * @return $this
     */
    public function setHashId($hashId)
    {
        $this->hashId = $hashId;

        return $this;
    }

    /**
     * @return string
     */
    public function getHashId()
    {
        return $this->hashId;
    }

    /**
     * @param $encryptionScheme
     *
     * @return $this
     */
    public function setEncryptionScheme($encryptionScheme)
    {
        $this->encryptionScheme = $encryptionScheme;

        return $this;
    }

    /**
     * @return string
     */
    public function getEncryptionScheme()
    {
        return $this->encryptionScheme;
    }

    /**
     * Set timestamp
     *
     * @param \DateTime $timestamp
     *
     * @return Computation
     */
    public function setTimestamp($timestamp)
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    /**
     * Get timestamp
     *
     * @return \DateTime
     */
    public function getTimestamp()
    {
        return $this->timestamp;
    }

    /**
     * @param $ipAddress
     *
     * @return $this
     */
    public function setIpAddress($ipAddress)
    {
        $this->ipAddress = $ipAddress;

        return $this;
    }

    /**
     * @return String
     */
    public function getIpAddress()
    {
        return $this->ipAddress;
    }

    /**
     * @param $authToken
     * 
     * @return $this
     */
    public function setAuthToken($authToken)
    {
        $this->authToken = $authToken;

        return $this;
    }

    /**
     * @return String
     */
    public function getAuthToken()
    {
        return $this->authToken;
    }
}

